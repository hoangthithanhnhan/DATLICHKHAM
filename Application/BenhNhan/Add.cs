﻿using Application.Core;
using DATLICHKHAM.Domain;
using MediatR;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DATLICHKHAM.Application.BenhNhan
{
    public class Add
    {
        public class Command : IRequest<Result<DLK_BenhNhan>>
        {
            public DLK_BenhNhanAddInfo Entity;
        }
        public class Handler : IRequestHandler<Command, Result<DLK_BenhNhan>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_BenhNhan>> Handle(Command request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaNguoiDung", request.Entity.MaNguoiDung);
                        parameters.Add("@HoTen", request.Entity.HoTen);
                        parameters.Add("@GioiTinh", request.Entity.GioiTinh);
                        parameters.Add("@NgaySinh", request.Entity.NgaySinh);
                        parameters.Add("@DiaChi", request.Entity.DiaChi);
                        parameters.Add("@TienSuBenh", request.Entity.TienSuBenh);
                        parameters.Add("@ThoiQuenSinhHoat", request.Entity.ThoiQuenSinhHoat);
                        parameters.Add("@GhiChuKhac", request.Entity.GhiChuKhac);
                        parameters.Add("@NgheNghiep", request.Entity.NgheNghiep);
                        parameters.Add("@TinhTrangHonNhan", request.Entity.TinhTrangHonNhan);
                        parameters.Add("@ThuocDangDung", request.Entity.ThuocDangDung);
                        parameters.Add("@LyDo", request.Entity.LyDo);
                        parameters.Add("@TrangThai", request.Entity.TrangThai);
                        var result = await connection.QuerySingleOrDefaultAsync<DLK_BenhNhan>("SP_Add_BenhNhan", parameters, commandType: CommandType.StoredProcedure);
                        return Result<DLK_BenhNhan>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_BenhNhan>.Failure(ex.Message);
                    }
                    finally
                    {
                        await connection.CloseAsync();
                    }
                }
            }
        }
    }
}

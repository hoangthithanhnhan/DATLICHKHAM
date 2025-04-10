using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ChungChiChuyenGia
{
    public class Add
    {
        public class  Command : IRequest<Result<DLK_ChungChiChuyenGia>> 
        {
            public DLK_ChungChiChuyenGiaAdd Entity;
        }
        public class Handler : IRequestHandler<Command, Result<DLK_ChungChiChuyenGia>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_ChungChiChuyenGia>> Handle(Command request, CancellationToken cancellationToken)
            {
                using ( var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaChuyenGia", request.Entity.MaChuyenGia);
                        parameters.Add("@TenChungChi", request.Entity.TenChungChi);
                        parameters.Add("NgayCap", request.Entity.NgayCap);
                        parameters.Add("NgayHetHan", request.Entity.NgayHetHan);
                        parameters.Add("SoHieuChungChi", request.Entity.SoHieuChungChi);
                        parameters.Add("ToChucCap", request.Entity.ToChucCap);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_ChungChiChuyenGia>("SP_Add_ChungChiChuyenGia", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_ChungChiChuyenGia>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_ChungChiChuyenGia>.Failure(ex.Message);
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

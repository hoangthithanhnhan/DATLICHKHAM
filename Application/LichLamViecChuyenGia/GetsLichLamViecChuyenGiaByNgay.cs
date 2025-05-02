using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.Identity.Client;

namespace DATLICHKHAM.Application.LichLamViecChuyenGia
{
    public class GetsLichLamViecChuyenGiaByNgay
    {
        public class Query: IRequest<Result<IEnumerable<DLK_LichLamViecChuyenGia>>>
        {
            public DateTime? Ngay;
            public int? MaChuyenGia;
            public bool? TrangThai;
            public int? MaLichLamViec;
        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<DLK_LichLamViecChuyenGia>>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<DLK_LichLamViecChuyenGia>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using(var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@Ngay", request.Ngay);
                        parameters.Add("@MaChuyenGia", request.MaChuyenGia);
                        parameters.Add("@TrangThai", request.TrangThai);
                        parameters.Add("@MaLichLamViec", request.MaLichLamViec);
                        var result = await connection.QueryAsync<DLK_LichLamViecChuyenGia>("SP_Gets_LichLamViecChuyenGiaByNgay", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<IEnumerable<DLK_LichLamViecChuyenGia>>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<IEnumerable<DLK_LichLamViecChuyenGia>>.Failure(ex.Message);
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
